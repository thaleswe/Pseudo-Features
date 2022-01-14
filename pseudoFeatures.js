const $newPseudo = function (selector) {
  const target =
    selector === "body" ? [document.body] : document.body.querySelectorAll(selector);

    console.log(target)

  const utils = {
    getPropertyData: (properties) => {
      const allItems = Object.entries(properties);
      let allProperties = [];

      allItems.forEach((itemData) => {
        const elementSelector = itemData[0];
        const elementProperties = itemData[1];
        const thisElement =
          elementSelector === "body"
            ? [document.body]
            : document.body.querySelectorAll(elementSelector);

        const allElementProperties = Object.entries(elementProperties);
        allElementProperties.push({
          element: thisElement,
          selector: elementSelector,
        });

        allProperties.push(allElementProperties);
      });

      return allProperties;
    },

    setProperties: (properties) => {
      const allItems = utils.getPropertyData(properties);

      allItems.forEach((allData) => {
        const elementData = allData.pop();
        const thisElement = elementData.element;

        thisElement.forEach((thisElement) => {
          allData.forEach((properties_data) => {
            const property_name = properties_data[0];
            const property_value = properties_data[1];
            const old_value = window.getComputedStyle(thisElement)[property_name];
  
            // trick to make the transition work
  
            thisElement.style[property_name] = old_value;
  
            setTimeout(() => {
              thisElement.style[property_name] = property_value;
            }, 0);
          });
        });
      });
    },

    removeProperties: (properties) => {
      const allItems = utils.getPropertyData(properties);

      allItems.forEach((allData) => {
        const elementData = allData.pop();
        const thisElement = elementData.element;

        thisElement.forEach((thisElement) => {
          allData.forEach((properties_data) => {
            const property_name = properties_data[0];
  
            thisElement.style.removeProperty(property_name);
          });
        });   
      });
    },
  };

  class PseudoClasses {
    hoverControl(hoverIn, hoverOut) {
      target.forEach((target) => {
        target.addEventListener("mouseenter", () => {
          hoverIn(target);
        });
  
        target.addEventListener("mouseleave", () => {
          hoverOut(target);
        });
      });
      
      return this;
    }

    interHover(requestedProperties) {
      target.forEach((target) => {
        target.addEventListener("mouseenter", () => {
          utils.setProperties(requestedProperties);
        });
  
        target.addEventListener("mouseleave", () => {
          utils.removeProperties(requestedProperties);
        });
      });     

      return this;
    }

    focusControl(focusIn, focusOut) {
      target.forEach((target) => {
        target.addEventListener("click", function targetListener() {
          focusIn(target);
          target.removeEventListener("click", targetListener);
  
          document.documentElement.addEventListener(
            "click",
            function htmlListener(event) {
              if (event.target !== target) {
                focusOut(target);
  
                target.addEventListener("click", targetListener);
                document.documentElement.removeEventListener(
                  "click",
                  htmlListener
                );
              }
            }
          );
        });
      });
      
      return this;
    }

    interFocus(requestedProperties) {
      target.forEach((target) => {
        target.addEventListener("click", function targetListener() {
          utils.setProperties(requestedProperties);
          target.removeEventListener("click", targetListener);
  
          document.documentElement.addEventListener(
            "click",
            function bodyListener(event) {
              if (event.target !== target) {
                utils.removeProperties(requestedProperties);
  
                target.addEventListener("click", targetListener);
                document.documentElement.removeEventListener(
                  "click",
                  bodyListener
                );
              }
            }
          );
        });
      });

      return this;
    }

    checkedControl(checkedIn, checkedOut) {
      target.forEach((target) => {
        target.addEventListener("change", function targetListener() {
          if (target.checked === true) {
            checkedIn(target);
          } else {
            checkedOut(target);
          }
        });
      });
      
      return this;
    }

    interChecked(requestedProperties) {
      target.forEach((target) => {
        target.addEventListener("change", function targetListener() {
          if (target.checked === true) {
            utils.setProperties(requestedProperties);
          } else {
            utils.removeProperties(requestedProperties);
          }
        });
      });
      
      return this;
    }
  }

  return new PseudoClasses();
};

