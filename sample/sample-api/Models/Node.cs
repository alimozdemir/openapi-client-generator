public class Node 
{
  public string Name { get; set; } = null!;
  public List<Node> Children { get; set; } = new List<Node>();
}