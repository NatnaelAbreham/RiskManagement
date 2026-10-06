namespace RiskManagement.Services
{
    public class FileStorageService
    {
        private readonly IConfiguration _config;

        public FileStorageService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> SaveFileAsync(
          IFormFile file,
          string folder,
          bool useDateFolders = false)
        {
            if (file == null || file.Length == 0)
                throw new Exception("Invalid file");

            var allowedExtensions = new[]
            {
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".jpg",
        ".jpeg",
        ".png"
    };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                throw new Exception("Unsupported file type");

            if (file.Length > 5 * 1024 * 1024)
                throw new Exception("File too large (max 5MB)");

            var root = _config["FileStorageSettings:RootPath"];

            if (string.IsNullOrWhiteSpace(root))
                throw new Exception("File storage root path is not configured.");

            string path = Path.Combine(root, folder);

            string relativePath = folder;

            if (useDateFolders)
            {
                var year = DateTime.Now.ToString("yyyy");
                var month = DateTime.Now.ToString("MMMM");

                path = Path.Combine(path, year, month);

                relativePath = Path.Combine(
                    relativePath,
                    year,
                    month
                );
            }

            Directory.CreateDirectory(path);

            var fileName = $"{Guid.NewGuid()}{extension}";

            var fullPath = Path.Combine(path, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Store the complete relative web path
            return $"{relativePath.Replace("\\", "/")}/{fileName}";
        }






    }

}