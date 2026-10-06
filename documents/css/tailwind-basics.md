# Tailwind CSS Basics

Tailwind CSS lets you style HTML by combining small utility classes directly in
your markup. Instead of creating a separate CSS rule for every element, add
classes for the layout, spacing, and colors you need.

## Flex layouts

Use `flex` to place an element's children in a row. Add other flex utilities to
align and space them:

```html
<div class="flex items-center justify-between gap-4">
  <span>Welcome</span>
  <button>Sign in</button>
</div>
```

- `flex` enables a flexbox layout.
- `items-center` aligns children along the cross axis.
- `justify-between` places the first and last children at opposite ends.
- `gap-4` adds space between children.

## Padding and spacing

Padding utilities add space inside an element. For example, `p-4` adds padding
on every side, while `px-4` adds horizontal padding and `py-2` adds vertical
padding. Direction-specific utilities include `pt-4` (top), `pr-4` (right),
`pb-4` (bottom), and `pl-4` (left).

Spacing values such as `2` and `4` come from Tailwind's spacing scale. Utilities
like `m-4` add margin instead of padding.

```html
<button class="px-4 py-2">Save</button>
```

## Colors

Use `text-*` utilities for text color and `bg-*` utilities for background color.
Color names can include a shade, such as `blue-700` or `gray-100`:

```html
<div class="bg-blue-700 p-4 text-white">
  A blue panel with white text
</div>
```

Color utilities can also style borders, for example `border border-gray-200`.
Tailwind's available colors and shades depend on its configuration.

## Putting it together

Utilities can be combined on the same element to build a complete style:

```html
<div class="flex items-center gap-4 rounded-lg bg-gray-100 p-4">
  <span class="text-blue-700">Profile</span>
  <button class="bg-blue-700 px-4 py-2 text-white">View</button>
</div>
```
