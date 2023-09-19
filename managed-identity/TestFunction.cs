using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Azure.Communication.Identity;
using Azure.Identity;

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
    }
}
