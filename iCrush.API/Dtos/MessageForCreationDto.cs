using System;

namespace iCrush.API.Dtos
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MesageSent { get; set; }
        public string Content { get; set; }
        public MessageForCreationDto()
        {
            MesageSent = DateTime.Now;
        }
    }
}