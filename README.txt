CREATIVE & PROFESSIONAL SERVICES TEMPLATE
Open index.html in a browser. No build step needed.

CONTENT   -> all text, menus and footers are plain HTML in each page.
             The nav (header) and footer are the same block on every page:
             edit one, then copy it to the others (search for id="site-header" / id="site-footer").
STYLE     -> style.css. Colours, fonts, radius and widths are the variables at the top
             (:root = light, [data-theme="dark"] = dark). Animations are in the "ANIMATION" section.
FUNCTION  -> script.js. CONFIG at the top sets default theme, form endpoint and which plugins run
             (theme toggle, reveal, counters, parallax, filters, forms...). Add your own with Site.use().
IMAGES    -> photos are Unsplash links in each <img src>. If a link fails, the local .jpg fallback shows.
             Replace with your own file names any time. Check the Unsplash licence for each photo you keep.
ARTICLES  -> article-1.html to article-3.html are demo posts. Copy one for each new article and link it from insights.html.
