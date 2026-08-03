namespace   RiskManagement.Services
{
    public class FileStorageService
    {
        private readonly IConfiguration _config;

        public FileStorageService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder, bool useDateFolders = false)
        {
            if (file == null || file.Length == 0)
                throw new Exception("Invalid file");

            //  file type validation (images only)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                throw new Exception("Only image files are allowed");

            //  size limit (5MB)
            if (file.Length > 5 * 1024 * 1024)
                throw new Exception("File too large (max 5MB)");

            var root = _config["FileStorageSettings:RootPath"];

            string path = Path.Combine(root, folder);

            if (useDateFolders)
            {
                path = Path.Combine(
                    path,
                    DateTime.Now.ToString("yyyy"),
                    DateTime.Now.ToString("MMMM")
                );
            }

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(path, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // return clean relative path
            return $"{folder}/{fileName}";
        }
    }

}