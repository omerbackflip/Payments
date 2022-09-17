<template>
  <div class="list row">
    <v-layout row wrap>

      <!-- (left side) main table list - 99  -->
      <v-flex xs12>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="חיפוש"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table :headers="headers" 
                      :items="tables"
                      :search="search"
                      disable-pagination
                      hide-default-footer
                      fixed-header
                      height="75vh"
                      dense
                      class="elevation-3"
                      loading = "isLoading"
                      loading-text="Loading... Please wait"
                      :expanded.sync="expanded"
                      item-key="table_code"
                      show-expand>
          <template v-slot:expanded-item="{item}">   
            <td>
              <p v-for="supplier in projects.filter(rec => rec.project === item.description)" 
                      :key="supplier.description" 
                      style="width: 100px;" 
                      @click="filterPayments(supplier.project,supplier.supplier)">
                {{ supplier.supplier }}
              </p>
            </td>
            <td></td>
            <td>
              <p v-for="supplier in projects.filter(rec => rec.project === item.description)" 
                      :key="supplier.description">
                {{ supplier.budget ? supplier.budget.toLocaleString() : '-'}} 
              </p>
            </td>
            <td>
              <p v-for="supplier in projects.filter(rec => rec.project === item.description)" 
                      :key="supplier.description">
                {{ supplier.payment ? supplier.payment.toLocaleString() : '-'}} 
              </p>
            </td>
          </template>
          <template v-slot:[`item.actions`]="{ item }"> 
            <div>
              <v-icon small @click="(itemToEdit === item.id) ? updateOne(item) : setEdit(item)">
                {{(itemToEdit === item.id) ? "mdi-floppy" : "mdi-pencil"}}
              </v-icon>
              <v-icon small @click="deleteOne(item.id)">mdi-delete</v-icon>
            </div>
          </template>
          <template v-slot:[`item.description`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.description"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.description}}</span>
            </div>
          </template>
          <template v-slot:[`item.numeric1`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.numeric1"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{ item.numeric1 ? item.numeric1.toLocaleString() : ''}}</span>
            </div>
          </template>
          <template v-slot:[`item.numeric2`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.numeric2"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.numeric2 ? item.numeric2.toLocaleString() : ''}}</span>
            </div>
          </template>
        </v-data-table>
      </v-flex>

      <!-- adding new row to the table -->
      <v-flex md10>
        <v-footer color="primary lighten-1" align="center" class="mt-2" elevation="10">
          <v-form ref="form" >
            <v-row>
              <v-col >
                <v-text-field v-model="tblFields.id" label="ID" :rules="fldRules"></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="tblFields.code" label="Code" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="tblFields.description" label="Description" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="tblFields.numeric1" label="Numeric1" required></v-text-field>
              </v-col>              
              <v-col >
                <v-text-field v-model="tblFields.numeric2" label="Numeric2" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="tblFields.date1" label="Date1" required></v-text-field>
              </v-col>              
            </v-row>
            <v-btn @click="addToTable"> -Add- </v-btn>
            <v-btn class="mx-3" @click="clearForm">Clear</v-btn>
          </v-form>
        </v-footer>
      </v-flex>
    </v-layout>

    <!-- Dialog for Supplier payments -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <h2 align="center">{{supName}}</h2>
        </v-card-title>
        <v-data-table :headers="supHeaders" 
                      :items="supPayments"
                      disable-pagination
                      hide-default-header
                      hide-default-footer
                      fixed-header
                      height="55vh"
                      dense
                      class="elevation-3"
                      loading = "isLoading"
                      loading-text="Loading... Please wait">
          <template v-slot:[`item.date`]="{ item }"> 
            <span> {{ item.date | formatDate}}</span>
          </template>
          <template v-slot:[`item.total`]="{ item }"> 
            <span> {{ item.total ? item.total.toLocaleString() : ''}}</span>
          </template>
          <template v-slot:[`item.actions`]="{ item }"> 
            <div>
              <Payment title="Update Payment" :paymentToUpdate="item"/>
              <v-icon small @click="deleteOne(item.id)">mdi-delete</v-icon>
            </div>
          </template>                
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import TableDataService from "../services/TableDataService";
import ProjectDataService from "../services/ProjectDataService";
import PaymentDataService from "../services/PaymentDataService";
import Payment from './Payment.vue';

export default {
  components: { Payment },
  name: "mainView",
  data() {
    return {
      tables: [],
      projects: [],
      payments: [],
      search: '',
      headers:[
        { text: "פרויקט", value: "description", class: 'success title', groupable: false },
        { text: "הוצאות", value: "numeric1", class: 'success title'},
        { text: "הכנסות", value: "numeric2", class: 'success title'},
        { text: "Act.", value: "actions", sortable: false, class: 'success title', groupable: false  },
      ],
      supHeaders:[
        // { text: "פרויקט", value: "project", class: 'success title', groupable: false },
        { text: "סכום", value: "amount", class: 'success title'},
        { text: "תאריך", value: "date", class: 'success title'},
        // { text: "חשבונית", value: "invoiceId", class: 'success title'},
        { text: "Act.", value: "actions", sortable: false, class: 'success title', groupable: false  },
      ],
      supPayments: [],
      supTotal: '',
      isLoading: true,
      itemToEdit: "",
      tblFields: {
        id:         "",
        code:       "",
        description:"",
        numeric1:   "",
        numeric2:   "",
        date1:      "",
      },
      fldRules: [v => !!v || 'Field is required'],
      expanded: [],
      dialog: false,
      supName: '',
    };
  },

  methods: {
    getProjects() {
      TableDataService.findByTableID(3)
        .then((response) => {
          this.tables = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getSuppliers() {
      ProjectDataService.getAll()
        .then((response) => {
          this.projects = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getPayments() {
      PaymentDataService.getAll()
      .then((response) => {
        this.payments = response.data.data;
      })
      .catch((e) => {
        console.log(e);
      });
    },

    filterPayments(proj,supp) {
      let total = 0;
      this.supPayments = this.payments.filter(item => {
                          return ((item.supplier === supp) && (item.project === proj))
                        });
      this.supPayments.forEach((num) => {
        console.log(num.amount)
        total+=num.amount;
      })
      this.supName = supp + " - " + proj + " - " + total.toLocaleString();
      this.dialog = true;
    },

    deleteOne(id) {
      if (window.confirm('Are you sure you want to delete one item ?')){
        TableDataService.delete(id)
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    refreshList() {
      this.getProjects();
    },

    clearForm (){
      this.$refs.form.reset()
    },

    editOne(id) {
      this.$router.push({ name: "table-details", params: { id: id } });
    },

    updateOne(item) {
      TableDataService.update(item.id, item)
        .then(response => {
          console.log(response.data);
          this.message = 'The updateOne() updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
        this.itemToEdit = '';
    },

    setEdit(item) {
      this.itemToEdit = item.id;
      setTimeout( () => {
        document.getElementById(`itemEdit-${item.id}`).focus()
      }, 1 );
    },

    addToTable() {
      var data = {
        table_id:     this.tblFields.id,
        table_code:   this.tblFields.code,
        description:  this.tblFields.description,
        numeric1:     this.tblFields.numeric1,
        numeric2:     this.tblFields.numeric2,
        date1:        this.tblFields.date1,
      };
      TableDataService.create(data)
        .then(response => {
          this.tblFields.id = response.data.id;
          this.refreshList();
          this.clearForm();
        })
        .catch(e => {
          console.log("sdkhfjkdh  ")
          console.log(e);
        });
    },

  },

  mounted() {
    this.getProjects();
    this.getSuppliers();
    this.getPayments();
  },
};



</script>

<style>
.list {
  text-align: left;
  max-width: auto;
  margin: auto;
}
.title {
  border: 3px solid blue;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
