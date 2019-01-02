using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using iCrush.API.Models;
using Newtonsoft.Json;

namespace iCrush.API.Data
{
    public class Seed
    {
        private DataContext _context { get; }
        public Seed(DataContext context)
        {
            this._context = context;

        }

        public void SeedUsers()
        {
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach( var user in users ) {
                byte[] passwordHash, passwordSalt;

                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();

                _context.Users.Add(user);
            }

            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new HMACSHA512()){
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}