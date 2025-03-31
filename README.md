# Radix overrides

Radix overrides is a base theme that fill the gap between the Radix theme and Drupal components used in project.
Like form, actions, modal, table, etc.
Or shared components like select 2 or other that need sass build with bootstrap variables.

# Installation

## Using Composer

To handle shared theme we use a custom composer type `drupal-shared-theme`.
You need to add the following configuration to your `composer.json` file:

```json
"extra": {
  "installer-types": ["drupal-shared-theme"],
  "installer-paths": {
      "web/themes/shared/{$name}": ["type:drupal-shared-theme"]
  }
}
```
    
Then you can require the theme with the following command:


```bash
composer require blend-it/radix_overrides
```

For contributors you could use the following command to clone the repository:
```bash
composer composer require blend-it/radix_overrides:6.0.x-dev --prefer-source
```

# Create child theme

To create a child theme :

Using drush:

    drush --include="web/themes/shared/radix_overrides" radix:create SUBTHEME_NAME






