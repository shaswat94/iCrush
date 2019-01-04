using System.Collections.Generic;
using System.Threading.Tasks;
using iCrush.API.Models;

namespace iCrush.API.Data
{
    public interface IiCrushRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);
    }
}