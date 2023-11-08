using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Communication.Identity;
using Azure.Identity;
using Azure.Communication.Email;

namespace acs_managed_identity_sample
{
    public static class TestFunction
    {
        [FunctionName("TestFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var endpoint = Environment.GetEnvironmentVariable("ACSResourceEndpoint");
            var credential = new DefaultAzureCredential();

            var tokenClient = new CommunicationIdentityClient(new Uri(endpoint), credential);

            var userResponse = await tokenClient.CreateUserAsync();
            string createdUserId = userResponse.Value.RawId;

            string responseMessage = $"Created userId: {createdUserId}";

            return new OkObjectResult(responseMessage);
        }

        [FunctionName("TestEmailFunction")]
        public static async Task<IActionResult> SendTestEmail(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var endpoint = Environment.GetEnvironmentVariable("ACSResourceEndpoint");
            var credential = new DefaultAzureCredential();

            var emailClient = new EmailClient(new Uri(endpoint), credential);

            var responseMessage = await emailClient.SendAsync(
                Azure.WaitUntil.Completed,
                Environment.GetEnvironmentVariable("EmailFrom"),
                Environment.GetEnvironmentVariable("EmailTo"),
                "Hello from Azure Communication Services!",
                "<html><body><h1>Hello from Azure Communication Services!</h1></body></html>");

            return new OkObjectResult(responseMessage);
        }
    }
}
