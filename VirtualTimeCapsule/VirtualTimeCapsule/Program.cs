using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using VirtualTimeCapsule.Services;

var builder = WebApplication.CreateBuilder(args);

// Explicitly bind to all network interfaces for mobile access
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5152); // HTTP
    serverOptions.ListenAnyIP(7279, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Add Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register Email Service
builder.Services.AddScoped<EmailService>();

// Register Background Automation Service
builder.Services.AddHostedService<VirtualTimeCapsule.Services.CapsuleAutomationService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt"];
                return Task.CompletedTask;
            }
        };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// CORS POLICY (Relaxed for development/ngrok)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Static Files BEFORE HTTPS redirection to allow HTTP access for media links
app.UseStaticFiles();

// Swagger (Development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disabled to prevent ngrok redirect loops

// Middleware Order
app.UseCors("AllowReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();