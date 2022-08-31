<template>
  <div class="list row">
    <v-layout row wrap>

      <v-flex xs12 md5>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="חיפוש פרויקט"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table :headers="headers" 
                      :items="projects"
                      :search="search"
                      disable-pagination
                      hide-default-footer
                      fixed-header
                      mobile-breakpoint=0
                      height="75vh"
                      dense
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

          <template v-slot:[`item.project`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.project"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.project}}</span>
            </div>
          </template>

          <template v-slot:[`item.supplier`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.supplier"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.supplier}}</span>
            </div>
          </template>

          <template v-slot:[`item.budget`]="{ item }"> 
            <div v-if = "itemToEdit === item.id">
              <v-text-field v-model="item.budget"
                            :id="`itemEdit-${item.id}`"/>
            </div>
            <div v-else @click="setEdit(item)">
              <span> {{item.budget}}</span>
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
                <v-text-field v-model="projFields.project" label="Project" :rules="fldRules"></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="projFields.supplier" label="Supplier" required></v-text-field>
              </v-col>
              <v-col >
                <v-text-field v-model="projFields.budget" label="Budget" required></v-text-field>
              </v-col>
            </v-row>
            <v-btn @click="addToProject"> -Add- </v-btn>
            <v-btn class="mx-3" @click="clearForm">Clear</v-btn>
          </v-form>
        </v-footer>
      </v-flex>
    </v-layout>
  </div>
</template>



<script>
import ProjectDataService from "../services/ProjectDataService";

export default {
  name: "project-list",
  data() {
    return {
      projects: [],
      search: '',
      headers:[
        { text: "Project", value: "project", class: 'success title'},
        { text: "Supplier", value: "supplier", class: 'success title'},
        { text: "Budget", value: "budget", class: 'success title', groupable: false },
        { text: "Act.", value: "actions", sortable: false, class: 'success title', groupable: false  },
      ],
      isLoading: true,
      itemToEdit: "",
      projFields: {
        project:"",
        supplier:"",
        budget :"",
      },
      fldRules: [v => !!v || 'Field is required'],
    };
  },

  methods: {
    retrieveProjects() {
      ProjectDataService.getAll()
        .then((response) => {
          this.projects = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    addToProject() {
      var data = {
        project:    this.projFields.project,
        supplier:   this.projFields.supplier,
        budget:  this.projFields.budget,
      };
      console.log(data)
      ProjectDataService.create(data)
        .then(response => {
          console.log(response.data);
          this.refreshList();
          this.clearForm();
        })
        .catch(e => {
          console.log("log from addToProject()")
          console.log(e);
        });
    },

    deleteOne(id) {
      if (window.confirm('Are you sure you want to delete one item ?')){
        ProjectDataService.delete(id)
          .then((response) => {
            console.log(response.data);
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },

    updateOne(item) {
      ProjectDataService.update(item.id, item)
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

    refreshList() {
      this.retrieveProjects();
    },

    clearForm (){
      this.$refs.form.reset()
    },

  },

  computed: {

  },

  mounted() {
    this.retrieveProjects();
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
