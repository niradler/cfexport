# CFExport

The idea came from the reason to create an .env file for client project, the variables are aws cloud formation exports.

## Use case

for example you just created cloudformation stack for the backend of your application, and you exported DEV-APIGATEWAY-URL.

with this package you can now create .env file in your client application and import this variable before build.

```.env
//.env.template
REACT_APP_APPLICATION_URL=DEV-APIGATEWAY-URL // you can use --prefix DEV- and then just put APIGATEWAY-URL
REACT_APP_IGNORE_PARAM=!dont-change // value starting with ! will be ignored.
```

```json
//package.json
"pre-build":"cfexport compile -v --file \"./.env.template\" --region us-east-1 --output \"./.env\" --format \".env\""
```

## Usage

```sh
npm i -g cfexport
```

```sh
cfexport compile -v --file "./.env.template.json" --region us-east-1 --output "./.env.json" --format "json"
cfexport compile -v --file "./.env.template" --region us-east-1 --output "./.env" --format ".env"
```

### Constraints

to make the call to aws to get the exports you need to have aws credential configure (by env or file, see aws sdk docs for more info)
make sure you have the access right to do: cloudformation:ListExports on Resource *
