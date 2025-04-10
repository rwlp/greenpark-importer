import * as fs from 'fs';
import * as path from 'path';
import { resolve } from 'path';
import * as fg from 'fast-glob';
import 'reflect-metadata';
import { TypeInjectGlobalConfig } from '@/config/typeinject/types/index';



async function getGlobalConfig(): Promise<TypeInjectGlobalConfig> {
  const CONFIG_FILE_PATH = path.join(process.cwd() + '/typeinject.config.ts');
  const module = await import(resolve(CONFIG_FILE_PATH));
  const globalConfig: TypeInjectGlobalConfig = module.default;

  return globalConfig;
}

async function getClassFiles(mainPath: string) {
  const files = fg.sync(`${mainPath}**/*.class.ts`);

  return files;
}

async function writeContainerFile(imports: string, configContent: string) {
  const config = await getGlobalConfig();
  const OUTPUT_DIR = config.outDir + 'container.ts';

  if (!fs.existsSync(path.dirname(OUTPUT_DIR))) {
    fs.mkdirSync(path.dirname(OUTPUT_DIR), { recursive: true });
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.writeFileSync(OUTPUT_DIR, '', 'utf8');
  } 

  fs.writeFileSync(OUTPUT_DIR, `${imports}\n\n${configContent}`);
}

function contentForSingletons(key: string, className: string, nameMethod?: string) {
  return `     ${key}: () => { 
    if (!container.singletons.has('${key}')) {
      container.singletons.set('${key}', ${nameMethod ? `new ${className}().${nameMethod}()` : `new ${className}()`})
    }

    return container.singletons.get('${key}') },\n`
}

async function main() {
  await writeContainerFile('', 'const container = {\n};\nexport default container\n\nexport type KeysForTypeInject = keyof typeof container | string;');

  const globalConfig = await getGlobalConfig();
  const { mainPath, aliases } = globalConfig;
  const files = await getClassFiles(mainPath);
  let configContent = 'const container = {\n singletons: new Map<string, any>(),\n';
  let imports = '';


  for (const classPathFile of files) {

    const module = await import(resolve(classPathFile));
    const targetClass = module.default;
    const alias = aliases[0];
    let hasImport = false;

    // Handle class
    const classMetaData = Reflect.getMetadata('provider', targetClass.prototype);
    const isSingletonClass = Reflect.getMetadata('singleton', targetClass.prototype);

    if (classMetaData) {
      hasImport = true;
      imports += `import ${targetClass.name} from '${alias.alias ? classPathFile.replace(alias.path, alias.alias).replace('.ts', '') : classPathFile.replace('.ts', '')}'\n`;

      if (isSingletonClass) {
        configContent += contentForSingletons(classMetaData, targetClass.name);
      } else {
        configContent += `  ${classMetaData}: () => new ${targetClass.name}(),\n`
      }

      console.log('Generate Provider For: ', classPathFile);
      console.log('KeyIs: ', classMetaData);
      console.log('isSingleton: ', !!isSingletonClass);
      console.log('TypeInstance is: ', targetClass.name)
    }

    // handle methods
    const aqui = Object.getOwnPropertyNames(targetClass);
    Object.getOwnPropertyNames(targetClass.prototype).forEach((nameMethod) => {
      const methodMetadata = Reflect.getMetadata('provider', targetClass.prototype, nameMethod);
      const isSingleton = Reflect.getMetadata('singleton', targetClass.prototype, nameMethod);

      if (methodMetadata) {
        if (!hasImport) {
          hasImport = true;
          imports += `import ${targetClass.name} from '${alias.alias ? classPathFile.replace(alias.path, alias.alias).replace('.ts', '') : classPathFile.replace('.ts', '')}'\n`;
        }

        if (isSingleton) {
          configContent += contentForSingletons(methodMetadata, targetClass.name, nameMethod);
        } else {
          configContent += `  ${methodMetadata}: () => new ${targetClass.name}().${nameMethod}(),\n`
        }

        console.log('Generate Provider For: ', classPathFile);
        console.log('KeyIs: ', methodMetadata);
        console.log('isSingleton: ', !!isSingletonClass);
        console.log('TypeInstance is: ', targetClass.name)
      }

    })
  };

  configContent += '};\n\nexport default container;\n\nexport type KeysForTypeInject = keyof typeof container;'


  await writeContainerFile(imports, configContent);
}

main();