export default async (dynamicImportedComponents) => {
  if (dynamicImportedComponents && Array.isArray(dynamicImportedComponents)) {
    for (const dynamicImportedComponent of dynamicImportedComponents) {
      if (dynamicImportedComponent && dynamicImportedComponent.load) {
        await dynamicImportedComponent.load();
      };
    };
  };
};
