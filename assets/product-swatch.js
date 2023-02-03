/***
*   Product Custom Form Components
*
***/
class VariantRadio extends HTMLElement {
  constructor() {
    super();
    let radioButtons = this.querySelectorAll("[option-data]");
    if (radioButtons.length > 0) {
      radioButtons.forEach(button => {
        button.addEventListener("click", (event) => {
          this.variantRadios(button);
        })
      })
    }
    const colorSwatchContainer = this.querySelector('.color-swatch');
    if (colorSwatchContainer) {
      const colorSwatches = colorSwatchContainer.querySelectorAll('.swatch');
      colorSwatches.forEach(swatch => {
        let colorHandle = swatch.querySelector('input[type="radio"]').dataset.handle;
        let swatchStyle = this.getSwatchStyle(colorHandle);
        swatch.querySelector('.swatch-label').setAttribute('style', swatchStyle);
      });
    }
  }
  /**
   * Listen to radio button updates and trigger a 
   * function to identify the variant
   **/  
  variantRadios(radioButton) {
    const response = document.getElementById("product-variant-json").textContent;
    const jsonObject = JSON.parse(response);
    let slideNo = radioButton.getAttribute("dataindex");
    quickShopSlider.slideTo(slideNo, 1000);
    let selectedOption = radioButton.title;
    jsonObject.variants.filter((variant) => {
      if (variant.title == selectedOption) {
        let variantId = variant.id;
        let productPrice = Shopify.formatMoney(variant.price);
        let productComparePrice = Shopify.formatMoney(variant.compare_at_price);
        document.querySelector("[actual_price]").innerHTML = `${productPrice}`;
        document.querySelector("[compare_at_price]").innerHTML = `${productComparePrice}`;
        if(variant.available === true) {
          document.querySelector("[ad_to_cart]").removeAttribute("disabled", "");
          document.querySelector("[ad_to_cart]").innerHTML = "ADD TO CART";
          let updateVar = document.querySelector("[ad_to_cart]");
          updateVar.setAttribute("variant_id", variantId)
        } else {
          document.querySelector("[ad_to_cart]").setAttribute("disabled", "");
          document.querySelector("[ad_to_cart]").innerHTML = "Sold Out";
        }
      }
    })
  }
  /**
   * Get swatch color code or image url
   * 
   **/  
  getSwatchStyle(colorName) {
    const swatchesColorList = JSON.parse(document.querySelector('[data-swatches-colorlist-json]').innerText);
    colorName = colorName.replace(/-|\s/g, '').toLowerCase();
    const swatch = swatchesColorList[colorName];
    let swatchStyle;
    if (typeof swatch !== 'undefined') {
      if (swatch.match(/\.(jpeg|jpg|png|gif)/g) != null) {
        swatchStyle = `background-image: url(${swatch})`;
      } else {
        swatchStyle = `background-color: ${swatch}`;
      }
      return swatchStyle;
    }
    return false;
  }
}
customElements.define("variant-radio", VariantRadio)