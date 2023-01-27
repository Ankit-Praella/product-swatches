/**
* Product Custom Form Components
*
*/
class VariantRadio extends HTMLElement{
  constructor() {
    super();
    var radioButtons = document.querySelectorAll("[option-data]");
    if (radioButtons.length > 0) {
      this.variantRadios(radioButtons)
    }
    this.form = this.closest('form') || this.querySelector('.form-element');
    this.formType = this.form.dataset.format;
    const colorSwatchContainer = this.querySelector('.color-swatch');
    if(colorSwatchContainer){
      const colorSwatches = colorSwatchContainer.querySelectorAll('.swatch');
      colorSwatches.forEach(swatch => {
        let colorHandle = swatch.querySelector('input[type="radio"]').dataset.handle;
        let swatchStyle = Utility.getSwatchStyle(colorHandle);
        swatch.querySelector('.swatch-label').setAttribute('style', swatchStyle);
      });
    }
  }
  
  // Listen to radio button updates and trigger a function to identify the variant
  variantRadios(radioButtons) {
    var optionSelector = document.querySelectorAll("[option-data]");
    console.log(optionSelector)
    const jsonStr = document.getElementById("product-variant-json").textContent;
    const jsonData = JSON.parse(jsonStr); 
    optionSelector.forEach(element => {
      element.addEventListener("change", (event) => {
        for (var radioButton of radioButtons) {
          if (radioButton.checked) {
            var data_indexno = radioButton.getAttribute("dataindex");
            quickShopSlider.slideTo(data_indexno, 1000);
            var selectedOption = radioButton.value;
            jsonData.variants.filter((variant) => {
              if (variant.title == selectedOption) {
                var variantId = variant.id;
                var productPrice = Shopify.formatMoney(variant.price);
                var productComparePrice = Shopify.formatMoney(variant.compare_at_price);
                document.querySelector("[actual_price]").innerHTML = `${productPrice}`;
                document.querySelector("[compare_at_price]").innerHTML = `${productComparePrice}`;
                if (variant.available === true) {
                  document.getElementById("add_cart").removeAttribute("disabled", "");
                  document.getElementById("add_cart").innerHTML = "ADD TO CART";
                  var updateVar = document.getElementById("add_cart");
                  updateVar.setAttribute("variant_id",variantId)
                } else {
                  document.getElementById("add_cart").setAttribute("disabled", "");
                  document.getElementById("add_cart").innerHTML = "Sold Out";
                }
              }
            })
          }
        }
      })
    })
  }  
}
customElements.define("variant-radio",VariantRadio)