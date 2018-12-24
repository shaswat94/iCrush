using iCrush.API.Modules;
using Microsoft.EntityFrameworkCore;

namespace iCrush.API.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options ): base(options){}
        public DbSet<Value> Values { get; set; }
    }
}