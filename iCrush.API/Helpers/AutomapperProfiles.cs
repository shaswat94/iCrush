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
        }
    }
}