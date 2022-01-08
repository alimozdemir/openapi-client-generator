using Microsoft.AspNetCore.Mvc;

namespace sample_api.Controllers;

[ApiController]
[Route("[controller]")]
public class OperationController : ControllerBase
{

    public OperationController()
    {
    }

    [HttpPost(Name = "Save")]
    public OperationModel Save()
    {
      return new OperationModel();
    }

    [HttpPatch(Name = "SaveMultiple")]
    public List<OperationModel> SaveMultiple()
    {
      return new List<OperationModel>();
    }

    [HttpPut(Name = "SaveMultipleWithClass")]
    public BulkOperations SaveMultipleWithClass()
    {
      return new BulkOperations();
    }

}
