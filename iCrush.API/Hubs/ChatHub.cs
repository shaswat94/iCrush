using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace iCrush.API.Hubs
{
    public class ChatHub: Hub
    {
        public async Task SendMessage(int id, string message)
        {
            await Clients.All.SendAsync("Send", id, message);
        }
    }
}