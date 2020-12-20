# tsconfig-init

- Create ts config file in the current directory, adds compile and auto-compile commands in package json file (it changes your indentation of the file defaults to 4)

## command

    - run this command in terminal
        - npx tsconfig-init
            - this will create tsconfig file in your current directory
            - current directory => directory opened in terminal
            - adds compile and auto compile commands in package json file
        - npx tsconfig-init -n -i 2
            - -n => npx flag to pass args
            - -i indentation flag => to pass spaces for tsconfig.json file
            - -c command flag => adds auto-compile and compile commands in package json (beware it also changes your indentation defaults to 4). its default value is true
            - --help
        - npx is available >= npm version (5.2.0)
            - you can install npx if your npm version is below 5.2.
                - npm i npx
