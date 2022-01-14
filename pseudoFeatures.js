const $newPseudo = function (selector) {
  const target =
    selector === "body"
      ? [document.body]
      : document.body.querySelectorAll(selector);

  const utils = {
    getPropertyData: (properties, thisTarget) => {
      const allItems = Object.entries(properties);
      let allProperties = [];

      allItems.forEach((itemData) => {
        const elementSelector = itemData[0];
        const elementProperties = itemData[1];
        let thisElement =
          elementSelector === "body"
            ? [document.body]
            : document.body.querySelectorAll(elementSelector);

        if (elementSelector === "this" && thisElement.length === 0) {
          thisElement = [thisTarget];
        }

        const allElementProperties = Object.entries(elementProperties);
        allElementProperties.push({
          element: thisElement,
          selector: elementSelector,
        });

        allProperties.push(allElementProperties);
      });

      return allProperties;
    },

    setProperties: (properties, thisTarget) => {
      const allItems = utils.getPropertyData(properties, thisTarget);

      allItems.forEach((allData) => {
        const elementData = allData.pop();
        const thisElement = elementData.element;

        thisElement.forEach((thisElement) => {
          allData.forEach((properties_data) => {
            const property_name = properties_data[0];
            const property_value = properties_data[1];
            const old_value =
              window.getComputedStyle(thisElement)[property_name];

            // trick to make the transition work

            thisElement.style[property_name] = old_value;

            setTimeout(() => {
              thisElement.style[property_name] = property_value;
            }, 0);
          });
        });
      });
    },

    removeProperties: (properties, thisTarget) => {
      const allItems = utils.getPropertyData(properties, thisTarget);

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

    singleTarget: (elementReference, requestedProperties) => {
      const allProperties = Object.entries(requestedProperties);
      elementReference.forEach((elementReference) => {
        allProperties.forEach((properties) => {
          const property_name = properties[0];
          const property_value = properties[1];

          elementReference.style[property_name] = property_value;
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
        target.addEventListener("mouseenter", (event) => {
          utils.setProperties(requestedProperties, event.target);
        });

        target.addEventListener("mouseleave", (event) => {
          utils.removeProperties(requestedProperties, event.target);
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
        target.addEventListener("click", function targetListener(firstEvent) {
          utils.setProperties(requestedProperties, firstEvent.target);
          target.removeEventListener("click", targetListener);

          document.documentElement.addEventListener(
            "click",
            function htmlListener(event) {
              if (event.target !== target) {
                utils.removeProperties(requestedProperties, firstEvent.target);

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
        target.addEventListener("change", function targetListener(event) {
          if (target.checked === true) {
            utils.setProperties(requestedProperties, event.target);
          } else {
            utils.removeProperties(requestedProperties, event.target);
          }
        });
      });

      return this;
    }

    nthChild(sequence, requestedProperties) {
      const elementReference = document.body.querySelectorAll(
        `${selector}:nth-child(${sequence})`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    nthLastChild(sequence, requestedProperties) {
      const elementReference = document.body.querySelectorAll(
        `${selector}:nth-last-child(${sequence})`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    nthOfType(reference, sequence, requestedProperties) {
      const elementReference = reference === "this"
      ? document.body.querySelectorAll(
        `${selector}:nth-of-type(${sequence})`
      )
      : document.body.querySelectorAll(
        `${selector} ${reference}:nth-of-type(${sequence})`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    nthLastOfType(reference, sequence, requestedProperties) {
      const elementReference = reference === "this"
      ? document.body.querySelectorAll(
        `${selector}:nth-last-of-type(${sequence})`
      )
      : document.body.querySelectorAll(
        `${selector} ${reference}:nth-last-of-type(${sequence})`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    firstChild(requestedProperties) {
      const elementReference = document.body.querySelectorAll(
        `${selector}:first-child`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    firstOfType(reference, requestedProperties) {
      const elementReference = reference === "this"
      ? document.body.querySelectorAll(
        `${selector}:first-of-type`
      )
      : document.body.querySelectorAll(
        `${selector} ${reference}:first-of-type`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    lastChild(requestedProperties) {
      const elementReference = document.body.querySelectorAll(
        `${selector}:last-child`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }

    lastOfType(reference, requestedProperties) {
      const elementReference = reference === "this"
      ? document.body.querySelectorAll(
        `${selector}:last-of-type`
      )
      : document.body.querySelectorAll(
        `${selector} ${reference}:last-of-type`
      );

      utils.singleTarget(elementReference, requestedProperties);

      return this;
    }
  }

  return new PseudoClasses();
};
