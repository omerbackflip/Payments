<template>
  <div class="list row">
    <v-layout row wrap>
      <v-flex>
        <v-row>
          <v-col class="mt-3">
            סה"כ = {{total.toLocaleString()}}
          </v-col>
          <v-col class="mt-3">
            תשלומים = {{count}}
          </v-col>
        </v-row>
        <v-list two-line dense rounded>
          <v-list-item-group
            v-model="selected"
            active-class="pink--text"
            multiple
          >
            <template v-for="(item, index) in payments">
              <v-list-item :key="item._id">
                <template v-slot:default>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.project"></v-list-item-title>
                    <v-list-item-subtitle class="text--primary">
                      חשבונית - {{item.invoiceId}}  שיק - {{item.payMethod}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{item.amount ? item.amount.toLocaleString():''}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{item.remark}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-action-text> {{item.date | formatDate}}</v-list-item-action-text>
                    <Payment title="Update Payment" :paymentToUpdate="item"/>
                    <!-- <v-icon small @click="editItem(item._id)">mdi-pencil</v-icon> -->
                    <v-icon small @click="deleteItem(item._id)">mdi-delete</v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider 
                v-if="index < payments.length - 1"
                :key="index"
                style="margin-top: 0px; margin-bottom: 0px;"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-flex>
    </v-layout>
  </div>
</template>



<script>
import PaymentDataService from "../services/PaymentDataService";
import TableDataService from "../services/TableDataService";
import Vue from 'vue'
import moment from 'moment'
import excel from 'vue-excel-export'
import Payment from "./Payment.vue"
Vue.use(excel)

Vue.filter('formatDate', function(value) {
  if (value) {
    //return moment(String(value)).format('MM/DD/YYYY hh:mm')
    return moment(String(value)).format('DD/MM/YYYY')
  }
});

export default {
  // components: {AddInvoice},
  components: {Payment},
  name: "payments-list",
  data() {
    return {
      payments: [], 
      isLoading: true,
      supplierList : [],
      selectedSupplier : "",
      selected: [],
      total: "",
      count: "",
    };
  },

  methods: {
    async retrievePayments() {
      PaymentDataService.findBySupplier(this.selectedSupplier)
        .then((response) => {   //where this response first defined ????????? (why in the controler we need to define "let response = {}")
          this.payments = response.data.data;
          this.total = response.data.total;
          this.count = response.data.count;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    loadTable:async function (table_id,key) {
      try {
        const response = await TableDataService.findByTableID(table_id);
        if(response) {
          this[key] = response.data.map(code => code.description);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async deleteItem(id){
      if (window.confirm ("are you sure?")){
        PaymentDataService.delete(id)
          .catch((e) =>{
            console.log(e);
        })
        this.retrievePayments();
      }
    },

    editItem(id){
      this.$router.push({ name: "payment", params: { id: id } });
    }
  },

  async mounted() {
    this.retrievePayments();
    await this.loadTable(1,'supplierList');
    this.isLoading = false;
    this.$root.$on('suppChange',(supp) => {
      this.selectedSupplier = supp;
    });
  },

  watch : {
      selectedSupplier () {
        this.retrievePayments();
      },
  }
}



</script>

<style>
.list {
  text-align: left;
  max-width: auto;
  margin: auto;
}
</style>
