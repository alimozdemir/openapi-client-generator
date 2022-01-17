using Microsoft.AspNetCore.Mvc;

namespace sample_api.Controllers;

[ApiController]
[Route("[controller]")]
public class NodeController : ControllerBase
{
    public NodeController()
    {
    }

    [HttpGet(Name = "Get")]
    public Node Get()
    {
      return new Node();
    }

}
