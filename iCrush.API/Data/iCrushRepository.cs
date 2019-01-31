using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using iCrush.API.Helpers;
using iCrush.API.Models;
using Microsoft.EntityFrameworkCore;

namespace iCrush.API.Data
{
    public class iCrushRepository : IiCrushRepository
    {
        private readonly DataContext _context;
        public iCrushRepository(DataContext context)
        {
            this._context = context;

        }
        
        /* Method of generic type to add data to memory(before changes are written to DB) */
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        /* Method of generic type to delete data from memory(before changes are written to DB) */
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        /* Method to return a particular user based on user id */
        public async Task<User> GetUser(int id)
        {
           var user = await _context.Users.Include( p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
           
           return user;
        }

        /* Method to get a PagedList of Users based on the UserParams from the client */
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include( p => p.Photos)
                .OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where( u => u.Id != userParams.UserId);
            
            users = users.Where ( u => u.Gender == userParams.Gender );

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where( u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if(!string.IsNullOrEmpty(userParams.OrderBy)) {
                switch (userParams.OrderBy) {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        /* Method to store UserLikes */
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);
            
            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select( i => i.LikerId);
            }

            return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
        }

        /* Method to get user photo by photo id */
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync( p => p.Id == id );

            return photo;
        }

        /* Method of generic type to save data to memory(changes are written to DB) */
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        /* Method to return the user's main photo */
        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where( u => u.UserId == userId ).FirstOrDefaultAsync( p => p.IsMain);
        }

        /* Method to get user likes(who liked whom and who was liked by whom) */
        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        /* Method to get message based on message id*/
        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync( m => m.Id == id);
        }

        /* Method to get conversation thread between two users */
        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId 
                    && m.ReceiverDeleted == false
                    && m.SenderId == recipientId || 
                    m.RecipientId == recipientId 
                    && m.SenderId == userId && m.SenderDeleted == false)
                .OrderByDescending(m => m.MessageSent).ToListAsync();
            
            return messages;
        }

        /* Method to get messages for an user based on message params */
        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                .AsQueryable();
            
            switch(messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.ReceiverDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default: //Unread messages
                    messages = messages.Where( u => u.RecipientId == messageParams.UserId 
                     && u.SenderDeleted == false  && u.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);
            
            return await PagedList<Message>.CreateAsync(messages, 
                messageParams.PageNumber, messageParams.PageSize);
        }
    }
}