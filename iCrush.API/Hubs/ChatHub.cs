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
    }
}