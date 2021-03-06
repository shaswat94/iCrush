using AutoMapper;
using iCrush.API.Data;
using iCrush.API.Dtos;
using iCrush.API.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace iCrush.API.Hubs
{
    public class ChatHub : Hub
    {
        public IiCrushRepository _repo { get; set; }
        public ChatHub(IiCrushRepository repo)
        {
            _repo = repo;
        }

        public async Task SendMessage(int id, MessageToReturnDto messageToReturnDto)
        {
            await Clients.All.SendAsync("Send", id, messageToReturnDto);
        }

        public async Task SendTyping(object sender)
        {
            // Broadcast the typing notification to all clients except the sender
            await Clients.Others.SendAsync("typing", sender);
        }

        public async Task SendLogOutMessage()
        {
            await Clients.Others.SendAsync("loggedOut", false);
        }

        public async Task SendLogInMessage(object sender)
        {
            await Clients.All.SendAsync("loggedIn", sender);
        }
    }
}