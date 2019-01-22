using System.Linq;
using AutoMapper;
using iCrush.API.Dtos;
using iCrush.API.Models;

namespace iCrush.API.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<User, UserForListDto>().ForMember( dest => dest.PhotoUrl, opt => {
                opt.MapFrom(src => src.Photos.FirstOrDefault( p => p.IsMain ).Url);
            }).ForMember( dest => dest.Age, opt => {
                opt.ResolveUsing( d => d.DateOfBirth.CalculateAge());
            });

            CreateMap<User, UserForDetailedDto>().ForMember( dest => dest.PhotoUrl, opt => {
                opt.MapFrom(src => src.Photos.FirstOrDefault( p => p.IsMain ).Url);
            }).ForMember( dest => dest.Age, opt => {
                opt.ResolveUsing( d => d.DateOfBirth.CalculateAge());
            });

            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<UserForUpdateDto, User>().ForMember( dest => dest.Id, opt => opt.Ignore());
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
            .ForMember(m => m.SenderPhotoUrl, opt => opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(m => m.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}