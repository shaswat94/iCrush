using System.Threading.Tasks;
using iCrush.API.Models;

namespace iCrush.API.Data
{
    public interface IAuthRepository
    {
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
         void SetUserOnlineStatus(int userid, bool status);
    }
}