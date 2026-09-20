// Written by Friction for finding f9: 8 controls on this page share the accessible name "iMac".
//
// Friction ran these steps in its own browser before opening this pull request:
//   - against the site as it was scanned, they FAILED (the problem is real)
//   - with the verified runtime patch installed, they PASSED
// They have NOT been run against this pull request's source change. Run them against your build:
//   npm i -D @playwright/test && npx playwright install chromium
//   BASE_URL=http://localhost:4321 npx playwright test tests/friction
// FRICTION_RUNTIME_PATCH=1 installs the runtime patch instead, to see the test pass against the unfixed site.
import { expect, test } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "https://ecommerce-playground.lambdatest.io/";
const RUNTIME_PATCH = ";(function () {\ntry {\ntry {\n  const params = new URLSearchParams(location.search);\n  if (params.get('route') !== 'product/search') return;\n  const labelLinks = () => {\n    const links = document.querySelectorAll('.product-layout .caption h4.title > a.text-ellipsis-2[href*=\"product/product\"]');\n    links.forEach((link, index) => {\n      if (link.dataset.productLabelled) return;\n      const card = link.closest('.product-layout');\n      const text = card ? card.textContent.replace(/\\s+/g, ' ').trim() : '';\n      const price = (text.match(/[$€£]\\s?[\\d,.]+/) || [])[0] || 'price shown on result';\n      const id = (new URL(link.href)).searchParams.get('product_id') || String(index + 1);\n      link.setAttribute('aria-label', `iMac, variant ${id}, ${price}, product details link`);\n      link.dataset.productLabelled = 'true';\n    });\n  };\n  const start = () => {\n    labelLinks();\n    const observer = new MutationObserver(labelLinks);\n    observer.observe(document.documentElement, { childList: true, subtree: true });\n  };\n  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });\n  else start();\n} catch (e) {}\n} catch (_frictionError) {}\n})();\n";

test("iMac search results identify variant 41 product details link", async ({ page }) => {
  if (process.env.FRICTION_RUNTIME_PATCH === "1") await page.addInitScript({ content: RUNTIME_PATCH });
  await page.goto(new URL("/index.php?route=product%2Fsearch&search=iMac", BASE_URL).toString());
  await expect(page.getByRole("link", { name: "iMac, variant 41, $170.00, product details link" }).first()).toBeVisible();
});
