# Bootstrap 5 Grid Cheat Sheet

Bootstrap's grid system arranges content in responsive rows and columns. It is
based on a 12-column layout: columns in a row share the available space, and
their widths can change at different screen sizes.

## The basic structure

- `.container` centers content and adds responsive horizontal padding.
- `.row` groups columns together and aligns them in a horizontal row.
- `.col` creates a column. Columns without a specified size share the row
  equally.

```html
<div class="container">
  <div class="row">
    <div class="col">First column</div>
    <div class="col">Second column</div>
    <div class="col">Third column</div>
  </div>
</div>
```

## Choosing column widths

You can choose a column's width by using a number from 1 to 12. The numbers in
one row should add up to 12 for a full-width layout.

```html
<div class="container">
  <div class="row">
    <div class="col-8">8 of 12 columns</div>
    <div class="col-4">4 of 12 columns</div>
  </div>
</div>
```

## Making columns responsive

Add a breakpoint to a column class to apply its width from that screen size
upward. For example, `.col-md-6` makes each column half-width on medium screens
and larger; below that, each column takes the full width.

```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6">First column</div>
    <div class="col-12 col-md-6">Second column</div>
  </div>
</div>
```

Common breakpoints include `sm`, `md`, `lg`, `xl`, and `xxl`. Include Bootstrap
5's CSS in your page for these grid classes to work.
