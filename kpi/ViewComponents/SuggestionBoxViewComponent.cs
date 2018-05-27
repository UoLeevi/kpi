using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace kpi.ViewComponents
{
    public class SuggestionBoxViewComponent : ViewComponent
    {
        public virtual IViewComponentResult Invoke(
            string datasetAttribute,
            string placeholder)
        {
            return View((
                items: Enumerable.Empty<string>(),
                datasetAttribute, 
                placeholder));
        }
    }
}
