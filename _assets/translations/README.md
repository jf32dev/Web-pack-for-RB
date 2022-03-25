
# Translations
Two helpers tools are available to POST and GET translation files from (OneSky)[https://bigtincan.oneskyapp.com/] translation service.

# Development
Add all required strings to en.json. We perform a **postFile** on this file only. All other translations are handled directly in OneSky and are synced to web app via **getFile**.

# Post File
Specify language code and input file.
```
node postFile -l en -i static/locales/en.json
```

# Get File
Specify language code and output directory.
```
node getFile -l en -o static/locales/
```

# Usage with Grunt
The following grunt tasks are available.
```
grunt postEn            # posts /static/locales/en.json
grunt getLang:langCode  # downloads {langCode}.json to /static/locales
```

# Tips
    Enclose passed variable values in curly braces.
        This string expects a {tab} variable.

## Useful links
* [react-intl](https://github.com/yahoo/react-intl)
* [Message Syntax](http://formatjs.io/guides/message-syntax/)
