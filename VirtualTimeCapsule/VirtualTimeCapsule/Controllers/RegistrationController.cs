using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VirtualTimeCapsule.BusinessLayer;
using VirtualTimeCapsule.Models;
using VirtualTimeCapsule.Services;

[Route("api/[controller]")]
[ApiController]
public class RegistrationController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    private readonly ILogger<RegistrationController> _logger;

    // Static dictionary to store OTPs temporarily (Email -> OTP)
    // In production, use Redis or a database table for this.
    private static ConcurrentDictionary<string, string> _otpStorage = new ConcurrentDictionary<string, string>();

    public RegistrationController(IConfiguration configuration, EmailService emailService, ILogger<RegistrationController> logger)
    {
        _configuration = configuration;
        _emailService = emailService;
        _logger = logger;
    }

    // SEND OTP API
    [HttpPost("SendOTP")]
    public async Task<IActionResult> SendOTP([FromBody] RegistrationClass model)
    {
        if (model == null || string.IsNullOrEmpty(model.Email))
            return BadRequest("Invalid email.");

        string email = model.Email.Trim().ToLower();

        // Check if user already exists
        BLRegistration bl = new BLRegistration();
        var existingUser = bl.GetUserByEmail(email);
        if (existingUser != null)
            return BadRequest(new { message = "Email already exists" });

        // Generate 6-digit OTP
        string otp = new Random().Next(100000, 999999).ToString();
        _otpStorage[email] = otp;

        try
        {
            string subject = "Your OTP for Virtual Time Capsule Registration";
            string body = $"<h3>Welcome to Virtual Time Capsule!</h3><p>Your OTP for registration is: <b>{otp}</b></p><p>This OTP is valid for 10 minutes.</p>";
            
            await _emailService.SendEmailAsync(email, subject, body);
            return Ok(new { message = "OTP sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send OTP email to {Email}", email);
            return StatusCode(500, $"Error sending email: {ex.Message}");
        }
    }

    // REGISTRATION CONTROLLER (Updated with OTP verification)
    [HttpPost("Register")]
    public IActionResult Register([FromBody] RegistrationClass model)
    {
        if (model == null)
            return BadRequest("Invalid data.");

        model.Email = model.Email.Trim().ToLower();
        model.Password = model.Password.Trim();

        // Verify OTP
        if (!_otpStorage.TryGetValue(model.Email, out string storedOtp) || storedOtp != model.Otp)
        {
            return BadRequest(new { message = "Invalid or expired OTP" });
        }

        BLRegistration bl = new BLRegistration();
        var existingUser = bl.GetUserByEmail(model.Email);

        if (existingUser != null)
            return BadRequest(new { message = "Email already exists" });

        bool result = bl.RegisterValues(model);

        if (result)
        {
            // Remove OTP after successful registration
            _otpStorage.TryRemove(model.Email, out _);
            return Ok("Registration successful.");
        }

        return BadRequest("Registration failed.");
    }

    // LOGIN CONTROLLER
    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginClass login)
    {
        if (login == null)
            return BadRequest("Invalid login data.");

        login.Email = login.Email.Trim().ToLower();
        login.Password = login.Password.Trim();

        BLRegistration bl = new BLRegistration();
        var user = bl.GetUserByEmail(login.Email);

        if (user == null)
            return Unauthorized("Invalid credentials.");

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);

        if (!isPasswordValid)
            return Unauthorized("Invalid credentials.");

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("THIS_IS_MY_SUPER_SECRET_KEY_12345"));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        Response.Cookies.Append("jwt", jwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.Now.AddHours(2)
        });

        return Ok(new
        {
            message = "Login successful",
            id = user.UserId,
            firstName = user.FirstName,
            email = user.Email,
            role = user.Role
        });
    }

    // FORGOT PASSWORD - SEND OTP
    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword([FromBody] RegistrationClass model)
    {
        if (model == null || string.IsNullOrEmpty(model.Email))
            return BadRequest("Invalid email.");

        string email = model.Email.Trim().ToLower();

        // Check if user exists
        BLRegistration bl = new BLRegistration();
        var existingUser = bl.GetUserByEmail(email);
        if (existingUser == null)
            return BadRequest(new { message = "Email not found" });

        // Generate 6-digit OTP
        string otp = new Random().Next(100000, 999999).ToString();
        _otpStorage[email] = otp;

        try
        {
            string subject = "Your OTP for Password Reset";
            string body = $"<h3>Password Reset Request</h3><p>Your OTP for resetting your password is: <b>{otp}</b></p><p>This OTP is valid for 10 minutes.</p>";

            await _emailService.SendEmailAsync(email, subject, body);
            return Ok(new { message = "OTP sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send reset OTP to {Email}", email);
            return StatusCode(500, $"Error sending email: {ex.Message}");
        }
    }

    // RESET PASSWORD - VERIFY OTP & UPDATE
    [HttpPost("ResetPassword")]
    public IActionResult ResetPassword([FromBody] RegistrationClass model)
    {
        if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.Otp))
            return BadRequest("Invalid data.");

        model.Email = model.Email.Trim().ToLower();
        model.Password = model.Password.Trim();

        // Verify OTP
        if (!_otpStorage.TryGetValue(model.Email, out string storedOtp) || storedOtp != model.Otp)
        {
            return BadRequest(new { message = "Invalid or expired OTP" });
        }

        BLRegistration bl = new BLRegistration();
        bool result = bl.UpdatePassword(model.Email, model.Password);

        if (result)
        {
            // Remove OTP after successful reset
            _otpStorage.TryRemove(model.Email, out _);
            return Ok(new { message = "Password updated successfully" });
        }

        return BadRequest(new { message = "Failed to update password" });
    }

    // LOGOUT CONTROLLER
    [HttpPost("Logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");
        return Ok("Logged out successfully.");
    }
}