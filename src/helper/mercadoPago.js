const mercadoPago = require('mercadopago')


const mercadoPagoLink = async (products) => {



    try {
        mercadoPago.configure({
            access_token : process.env.ACCESS_TOKEN
        })

        const preference = {
            items: products.map(p => {
                return {
                    title: p.name,
                    quantity: p.count,
                    currency_id: 'ARS',
                    unit_price: p.price
                }
            }),
    

            notification_url : 'https://cell-store-api.onrender.com/notification'

          };
          
         const response = await mercadoPago.preferences.create(preference)

         return response.body.init_point
    } catch (error) {
        console.log(error)
    }
}

module.exports = mercadoPagoLink