<template>
  <div class="list row">
    <!-- <div class="input-group mb-3 mt-3">
      <input type="text" class="form-control" placeholder="Search in description field" v-model="searchStr"/>
      <v-btn @click="searchSTR" class="ml-2 mr-2"> Search </v-btn>
    </div>  -->
    <v-layout row wrap>
      <v-flex xs12 md10>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search1"
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <export-excel 
              :data="payments" 
              :fields="xlsHeders"
              type="xlsx"
              name="export"
              title="This is Title"
              footer="This is footer"
              class="mt-3">
              <v-btn class="btn btn-danger"> 
                <v-icon>mdi-download</v-icon>Download To Excel
              </v-btn>
            </export-excel>
          </v-col>
          <v-col cols="12" sm="6" md="3">
              <v-btn class="mt-3 btn btn-danger" @click="removeAllPayments">
                Remove All
              </v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
              <v-select class="mt-3"
                :items="supplierList"
                v-model="selectedSupplier"
                dense
                solo
            ></v-select>
          </v-col>
        </v-row>
        <v-data-table 
            :headers="headers"
            :items="payments" 
            :search="search"
            @click:row="rowClicked"
            disable-pagination
            hide-default-footer
            fixed-header
            height="75vh"
            class="elevation-3"
            :item-class="itemRowBackground"
            loading = "isLoading"
            loading-text="Loading... Please wait"
            item-key="_id"
          >
          <template v-slot:[`item.actions`]="{ item }"> 
            <v-icon small @click="editOne(item._id)">mdi-pencil</v-icon>
            <v-icon small @click="deleteOne(item._id)">mdi-delete</v-icon>
          </template>
          <template v-slot:[`item.date`]="{ item }"> 
            <span> {{item.date | formatDate}}</span>
          </template>
          <template v-slot:[`item.total`]="{ item }"> 
            <span> {{item.total ? item.total.toLocaleString() : ''}}</span>
          </template>
          <template v-slot:[`item.vat`]="{ item }"> 
            <span> {{item.vat ? item.vat.toLocaleString() : ''}}</span>
          </template>
          <template v-slot:[`item.amount`]="{ item }"> 
            <span> {{item.amount ? item.amount.toLocaleString() : ''}}</span>
          </template>
        </v-data-table>
        <v-footer color="primary lighten-1" align="center" elevation="10">
          <v-form ref="form" >
            <v-row>
              <v-col >
                <v-dialog ref="dialog" :return-value.sync="payment.date" persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      v-model="payment.date"
                      label="Date"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on" 
                      required>
                    </v-text-field>
                  </template> 
                  <v-date-picker v-model="payment.date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="dialog=false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(payment.date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.project" label="Project" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.amount" label="Amount" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.vat" label="Vat"></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.total" label="Total" required></v-text-field>
              </v-col>  
              <v-col >
                <v-text-field v-model="payment.clear" label="Clear %"></v-text-field>
              </v-col>
              <v-col >
                <v-combobox
                  v-model="payment.supplier"
                  :items="supplierList"
                  label="Supplier"
                  dense
                ></v-combobox>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.invoiceId" label="Invoice ID" required></v-text-field>
              </v-col>                
              <v-col >
                <v-text-field v-model="payment.payMethod" label="Cheque ID" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="payment.remark" label="Remark" required></v-text-field>
              </v-col>  
            </v-row>
            <v-btn @click="savePayment"> -Add- </v-btn>
            <v-btn class="mx-3" @click="clearForm">Clear</v-btn>
          </v-form>
        </v-footer>
      </v-flex>

      <!-- this section is the summary of the supplier -->
      <v-flex md2>
        <v-container v-if = "currInvoice" class="grey lighten-2 mx-5 mt-5 elevation-3" >
          <export-excel 
            :data="supplierFilter" 
            :fields="xlsHeders"
            type="xlsx"
            :name=currInvoice.supplier
            :title=currInvoice.supplier
            :footer=this.supplierTotal.toLocaleString()
            class="mt-3">
            <h5 style="text-align:center">{{currInvoice.supplier}}   -   {{this.supplierTotal.toLocaleString()}}
              <v-btn small class="btn btn-danger"> 
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </h5>
          </export-excel>
          <v-data-table :headers="sideHeaders"
                        :items="supplierFilter" 
                        disable-pagination
                        hide-default-footer
                        fixed-header
                        class="elevation-3"
                        dense>
            <template v-slot:[`item.total`]="{ item }"> 
              <span> {{item.total ? item.total.toLocaleString() : ''}}</span>
            </template>
          </v-data-table>
        </v-container>
        <v-container v-if = "currInvoice" class="grey lighten-2 mx-5 mt-5 elevation-3" >
          <export-excel 
            :data="projectFilter" 
            :fields="xlsHeders"
            type="xlsx"
            :name=currInvoice.project
            :title=currInvoice.project
            :footer=this.projectTotal.toLocaleString()
            class="mt-3">
            <h5 style="text-align:center">{{currInvoice.project}}   -   {{this.projectTotal.toLocaleString()}}
              <v-btn small class="btn btn-danger"> 
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </h5>
          </export-excel>

          <v-data-table :headers="sideHeaders"
                        :items="projectFilter" 
                        disable-pagination
                        hide-default-footer
                        fixed-header
                        class="elevation-3"
                        dense>
            <template v-slot:[`item.total`]="{ item }"> 
              <span> {{item.total ? item.total.toLocaleString() : ''}}</span>
            </template>
          </v-data-table>
        </v-container>
      </v-flex>
    </v-layout>
    
  </div>
</template>



<script>
import PaymentDataService from "../services/PaymentDataService";
// import BookDataService from "../services/BookDataService";
import TableDataService from "../services/TableDataService";
// import AddInvoice from "./AddInvoice.vue"
import Vue from 'vue'
import moment from 'moment'
import excel from 'vue-excel-export'
Vue.use(excel)

Vue.filter('formatDate', function(value) {
  if (value) {
    //return moment(String(value)).format('MM/DD/YYYY hh:mm')
    return moment(String(value)).format('DD/MM/YYYY')
  }
});

export default {
  // components: {AddInvoice},
  name: "payments-list",
  data() {
    return {
      payments: [],
      currInvoice: null,
      currentIndex: -1,
      companyName   : [],
      projectName   : [],
      supplierName  : [],
      expanded: [],
      supplierTotal : 0,
      supplierFilter: [],
      sideHeaders: [
        { text: "Total", value: "total", align:'right'},
        { text: "Description", value: "description", align:'right'},
      ],
      projectTotal : 0,
      projectFilter: [],
      search: '',
      headers:[
        { text: "Date", value: "date", class: 'success title', groupable: false  },
        { text: "Project", value: "project", class: 'success title' },
        { text: "Supplier", value: "supplier", class: 'success title', align:'right' },
        { text: "Amount", value: "amount", class: 'success title', groupable: false, align:'right'  },
        { text: "Vat", value: "vat", class: 'success title', groupable: false, align:'right'  },
        { text: "Total", value: "total", class: 'success title', groupable: false, align:'right'  },
        { text: "Clear %", value: "clear", class: 'success title', groupable: false, align:'right'  },
        { text: "Cheque ID", value: "payMethod", class: 'success title', groupable: false, align:'right'  },
        { text: "Invoice ID", value: "invoiceId", class: 'success title', groupable: false, align:'right'  },
        { text: "Remark", value: "remark", class: 'success title', groupable: false, width: '20%', align:'right'  },
        { text: "Act.", value: "actions", sortable: false, class: 'success title', groupable: false  },
      ],
      xlsHeders:{
        "פרויקט"      :"project", 
        "תאור"        :"description",
        "סכום"        :"amount",
        "מע-מ"        :"vat",
        "סה-כ"        :"total",
        "תאריך"       :"date",
        "ספק"         :"supplier",
        "חשבונית"     :"invoiceId",
        "הערה"        :"remark",
      },
      payment: {
        id:           null,
        project:      "",
        clear:        "",
        amount:       null,
        vat:          null,
        total:        null,
        payMethod:    "",
        date:         null,
        supplier:     "",
        invoiceId:    "",
        remark:       "",
      },  
      fldRules: [v => !!v || 'Field is required'],
      isLoading: true,
      itemToEdit: "",
      corrolatedBook: "",
      supplierList : [],
      selectedSupplier : "",
      start: 0,
      timeout: null,
      rowHeight: 24,
      perPage: 25,
    };
  },

  methods: {
    rowClicked(row) {
      this.currInvoice = row;
      if(row.supplier || row.project){
        this.supplierFilter = this.payments.filter(supp => supp.supplier === row.supplier);
        //this.supplierTotal = this.supplierFilter.reduce(num1 => num1.total);
        this.supplierTotal = 0;
        for (let i=0; i< this.supplierFilter.length ;i++ ){
          this.supplierTotal += this.supplierFilter[i].total;
        }
        this.projectFilter = this.payments.filter(supp => supp.project === row.project);
        this.projectTotal = 0;
        for (let i=0; i< this.projectFilter.length ;i++ ){
          this.projectTotal += this.projectFilter[i].total;
        }
      }
    },

    deleteOne(id) {
      if (window.confirm('Are you sure you want to delete one item ?')){
        PaymentDataService.delete(id)
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    retrievePayments() {
      PaymentDataService.findBySupplier(this.selectedSupplier)
        .then((response) => {
          this.payments = response.data;
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

    refreshList() {
      this.retrievePayments();
      this.currInvoice = this.payments[0];
      this.currentIndex = -1;
    },

    setActivePayment(payment, index) {
      this.currInvoice = payment;
      this.currentIndex = index;
    },

    removeAllPayments() {
      if (window.confirm('Are you sure you want to delete all items ?')){
        PaymentDataService.deleteAll()
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    searchSTR() {
      PaymentDataService.findByTitle(this.searchStr)
        .then((response) => {
          this.payments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    deleteItem(id) { //this function doesnt work.... check why 28.09.21
      const index = this.payment.indexOf((x) => x.id === id);
      this.payment.splice(index, 1);
    },

    savePayment() {
      PaymentDataService.create(this.payment)
        .then(response => {
          this.payment.id = response.data.id;
          this.refreshList();
          this.clearForm();
        })
        .catch(e => {
          console.log(e);
        });
    },

    clearForm (){
      this.$refs.form.reset()
    },

    editOne(id) { // this is example how to call to different page using router
      this.$router.push({ name: "payment-details", params: { id: id } });
    },

    updateOne(item) {
      PaymentDataService.update(item._id, item)
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
        this.itemToEdit = '';
    },

    setEdit(item) {
      this.itemToEdit = item._id;
      setTimeout( () => {
        document.getElementById(`itemEdit-${item._id}`).focus()
      }, 1 );
    },

		//Background of row if added to Book table
		itemRowBackground(item) {
			return item.pratim ? 'bg-green' : '';
		},
  },
  async mounted() {
    this.retrievePayments();
    await this.loadTable(1,'supplierList');
    this.isLoading = false;
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

.bg-green{
	background-color: lightgreen !important;
}

</style>
