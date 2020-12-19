const loadDynamicImportedComponents = async (dynamicImportedComponents) => {
  const WrappedComponents = [];

  if (dynamicImportedComponents && Array.isArray(dynamicImportedComponents)) {
    for (const dynamicImportedComponent of dynamicImportedComponents) {
      if (dynamicImportedComponent && dynamicImportedComponent.load) {
        WrappedComponents.push(await dynamicImportedComponent.load());
      }
    }
  }

  return WrappedComponents;
};

module.exports = loadDynamicImportedComponents;
