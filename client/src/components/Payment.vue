<template>
    <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn x-small v-bind="attrs" v-on="on">
                <v-icon small>{{paymentToUpdate ? 'mdi-pencil' : 'mdi-plus'}} </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <h2>{{title}}</h2>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="4" sm="6" md="4">
                            <v-text-field v-model="payment.amount" label="Amount"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.vat" label="vat"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.total" label="total"></v-text-field>
                        </v-col>          
                        <v-col cols="4">
                            <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="payment.date" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field 
                                    v-model="payment.date"
                                    label="תאריך"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on" >
                                    </v-text-field>
                                </template> 
                                <v-date-picker v-model="payment.date" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(payment.date)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.supplier" label="Supplier"></v-text-field>
                        </v-col>   
                        <v-col cols="4">
                            <v-text-field v-model="payment.invoiceId" label="Invoice"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.project" label="Project"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.payMethod" label="credit"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="payment.clear" label="clearance"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="payment.remark" label="Remark"></v-text-field>
                        </v-col>                           
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog=false">close</v-btn>
                <v-btn color="primary" @click="savePayment()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import PaymentDataService from "../services/PaymentDataService";
export default {
    name: "payment",
    props:['title','paymentToUpdate'],
    data () {
      return {
        payment: {
          project:      "",
          clear:        null,
          amount:       null,
          vat:          null,
          total:        null,
          payMethod:    "",
          date:         null,
          supplier:     "",
          invoiceId:    "",
          remark:       "",
        },  
        dialog: false,
        dateModal : false,
      }
    },

    methods: {
        savePayment() {
            if (this.paymentToUpdate)
                PaymentDataService.update(this.payment._id, this.payment)
                else
                PaymentDataService.create(this.payment)
            .then(response => {
                console.log('create invoiceId=',response.data.invoiceId)
            })
            .catch(e => {
                console.log(e);
            });
            this.dialog = false;
        },
    },

     mounted(){
		this.payment = this.paymentToUpdate ?  this.paymentToUpdate : {};
        console.log("Payment.vue is mounted") 
	}
}
</script>