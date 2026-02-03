// CSS Modules declaration for TypeScript
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export = classes;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
