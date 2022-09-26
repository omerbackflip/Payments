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
                      :items="table99"
                      :search="search"
                      disable-pagination
                      hide-default-footer
                      fixed-header
                      height="75vh"
                      @click:row="filterTbl"
                      dense
                      class="elevation-3"
                      loading = "isLoading"
                      loading-text="Loading... Please wait"
                      :expanded.sync="expanded"
                      item-key="table_code"
                      show-expand>
          <template v-slot:expanded-item="{item}">   
            <td></td>
            <td></td>
            <td></td>
            <td>
              <p v-for="source in tables.filter(rec => rec.table_id === item.table_code)" :key="source.table_code" style="width: 100px;">
                {{ source.description }} 
              </p>
            </td>
            <td>
              <p v-for="source in tables.filter(rec => rec.table_id === item.table_code)" :key="source.table_code">
                {{ source.numeric1 ? source.numeric1.toLocaleString() : '-'}} 
              </p>
            </td>
            <td>
              <p v-for="source in tables.filter(rec => rec.table_id === item.table_code)" :key="source.table_code">
                {{ source.numeric2 ? source.numeric2.toLocaleString() : '-'}} 
              </p>
            </td>
          </template>
          <template v-slot:[`item.actions`]="{ item }"> 
            <!-- <v-icon small @click="editOne(item.id)">mdi-pencil</v-icon> -->
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
            <!-- <div v-else @click="setEdit(item)"> -->
            <div v-else @click="setEdit(item)">
              <span> {{item.description}}</span>
            </div>
          </template>
          <template v-slot:[`item.table_id`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.table_id"
                            :id="`itemEdit-${item.id}`"/>
                            <!-- @blur="updateOne(item)"/> -->
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.table_id}}</span>
            </div>
          </template>
          <template v-slot:[`item.table_code`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.table_code"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.table_code}}</span>
            </div>
          </template>
        </v-data-table>
      </v-flex>

      <!-- (Right side) table details -->
      <!-- <v-flex xs12 md4 mt-3>
        <div class="title"> {{ tableTitle ? tableTitle : 'Title' }} </div>
        <v-data-table :headers="headers" 
                      :items="tableCode"
                      disable-pagination
                      dense
                      hide-default-footer
                      fixed-header
                      height="75vh"
                      class="elevation-3"
                      loading = "isLoading"
                      loading-text="Loading... Please wait">
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
          <template v-slot:[`item.table_id`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.table_id"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.table_id}}</span>
            </div>
          </template>
          <template v-slot:[`item.table_code`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.table_code"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.table_code}}</span>
            </div>
          </template>
        </v-data-table>
      </v-flex> -->

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
  </div>
</template>



<script>
import TableDataService from "../services/TableDataService";

export default {
  name: "table-list",
  data() {
    return {
      tables: [],
      table99: [],
      tableCode: [],
      tableTitle: '',
      currInvoice: null,
      currentIndex: -1,
      search: '',
      headers:[
        { text: "ID", value: "table_id", class: 'success title'},
        { text: "CODE", value: "table_code", class: 'success title'},
        { text: "Description", value: "description", class: 'success title', groupable: false },
        { text: "NUMERIC1", value: "numeric1", class: 'success title'},
        { text: "NUMERIC2", value: "numeric2", class: 'success title'},
        { text: "DATE1", value: "date1", class: 'success title'},
        { text: "Act.", value: "actions", sortable: false, class: 'success title', groupable: false  },
      ],
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
    };
  },

  methods: {
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

    retrieveTables() {
      TableDataService.getAll()
        .then((response) => {
          this.tables = response.data;
          this.table99 = response.data.filter(item => item.table_id === 99);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveTables();
      this.currInvoice = null;
      this.currentIndex = -1;
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

    filterTbl(row) {
      this.tableCode = this.tables.filter(item => item.table_id === row.table_code)
      this.tableTitle = row.description;
    }
  },

  computed: {

  },

  mounted() {
    this.retrieveTables();
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
