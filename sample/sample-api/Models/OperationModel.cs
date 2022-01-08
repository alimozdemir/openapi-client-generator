public class OperationModel 
{
  public string Id { get; set; } = null!;
  public string? Message { get; set; }
  public OperationStatus Status { get; set; }
}