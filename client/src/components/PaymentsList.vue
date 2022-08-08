<template>
  <div class="list row">
    <v-layout row wrap>
      <v-flex>
        <v-list v-show="!noData" two-line dense rounded>
          <v-list-item-group v-model="selected" active-class="pink--text">
            <template v-for="(item, index) in payments">
              <v-list-item :key="item._id"> <!-- @click="editItem(item._id)" -->
                <template v-slot:default>
                  <v-list-item-content>
                    <v-list-item-title v-if="!selectedSupplier" class="right"> {{item.supplier}} </v-list-item-title>
                    <v-list-item-subtitle class="blue--text">
                      {{item.amount ? item.amount.toLocaleString():''}} - {{item.date | formatDate}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      {{item.invoiceId ? 'Inv: '+item.invoiceId : ''}} - {{item.payMethod ? 'Chequ:'+item.payMethod : ''}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="right">
                      {{item.remark ? item.remark : ''}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-title v-text="item.project"></v-list-item-title>
                    <Payment title="Update Payment" :paymentToUpdate="item"/>
                    <v-btn x-small>
                    <v-icon small @click="deleteItem(item._id)">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider 
                v-if="index < payments.length - 1"
                :key="index"
                style="margin-top: 0px; margin-bottom: 0px;"
                color="#0d6efd"
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
// import excel from 'vue-excel-export'
import Payment from "./Payment.vue"
// Vue.use(excel)

Vue.filter('formatDate', function(value) {
  if (value) {
    //return moment(String(value)).format('MM/DD/YYYY hh:mm')
    return moment(String(value)).format('DD/MM/YYYY')
  }
});

export default {
  components: {Payment},
  name: "payments-list",
  props: ['noData'],
  data() {
    return {
      payments: [], 
      isLoading: true,
      supplierList : [],
      budget : [],
      selectedSupplier : "",
      selected: [],
      total: "",
      count: "",
      cycle: false,
      aaa: 9999,
    };
  },

  methods: {
    async retrievePayments() {
      PaymentDataService.findBySupplier(this.selectedSupplier)
        .then((response) => {   //where this response first defined ????????? (why in the controler we need to define "let response = {}")
          const {data , total , count} = response.data;
          this.payments = data;
          this.total = total;
          this.count = count;
          this.$emit('getData',count,total);
          this.$emit('total',this.total,'count',this.count);
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
    },
  },

  async mounted() {
    this.retrievePayments();
    await this.loadTable(1,'supplierList');
    await this.loadTable(2,'budget');
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

.v-list {
    padding-right: 0px;
    padding-left: 0px;
}

.v-list-item{
    padding-right: 0px;
    padding-left: 0px;
}

.v-list-item__content{
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}

.header {
  margin-top: 0px !important;
}

.row {
  justify-content: space-around !important;
}

.flex {
    padding-left: 0px;
    padding-right: 0px;
}

.right {
  text-align: right;
}
</style>
