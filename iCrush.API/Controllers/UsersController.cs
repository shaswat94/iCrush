using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using iCrush.API.Data;
using iCrush.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace iCrush.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IiCrushRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IiCrushRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;

        }

        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var userToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(userToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

    }
}