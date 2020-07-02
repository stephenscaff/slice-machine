const set = require("lodash.set");
const get = require("lodash.get");
const merge = require("lodash.merge");

/**
 * Merges slices models with custom types
 * @param  {Array} ct                 Array of custom_types [{ id: 'page', name: 'Page', value: {} }]
 * @param  {Object} slices            Slices definitions { main_header: {}, other_slice: {}}
 * @param  {Array[String]} customTypesToMerge list of custom types ids to merge (eg. ['page', 'homepage'])
 * @return {Array}                    Merged custom types
 */
function mergeWithSlices(ct, slices, customTypesToMerge) {
  return ct.map(elem => {
    if (customTypesToMerge.indexOf(elem.id) !== -1) {
      const entries = Object.entries(elem.value || {})
        .reduce((acc, [key, value]) => {
          const szKeys = Object.keys(value).filter(e => value[e].type === 'Slices')
          if (szKeys.length) {
            return [...acc, [key, szKeys]]
          }
          return acc
        }, [])

      if (!entries.length) {
        return
      }
      entries.forEach((entry) => {
        const [key, szKeys] = entry
        szKeys.forEach((szKey) => {
          const currSlices = get(elem.value[key][szKey], `config.choices`, {})
          const merged = merge(currSlices, slices);
          set(elem, `value.${key}.${szKey}.config.choices`, merged)
        })
      })
    }
    return elem;
  });
}

function customTypes(index, cts) {
  return index.map((ct) => {
    return {
      ...ct,
      value: cts[ct.id] ? cts[ct.id] : {}
    };
  });
};

function format(index, customTypes, slices, keysToMerge) {
  return {
    routes: index.map(ct => ct.route),
    customTypes,
    slices,
    keysToMerge,
    files: Object.entries(customTypes)
      .reduce((acc, [fileName, content]) => ({
      ...acc,
      [fileName]: content
    }))
  }
}

module.exports = {
  landing: function(slices) {
    const index = require("./landing/index.json");
    const customTypes = index.reduce((acc, ct) => ([...acc, {
      ...ct,
      value: require(`./landing/${ct.value}`)
    }]), []);
    return format(index, customTypes, slices, ['page'])
  }
}
