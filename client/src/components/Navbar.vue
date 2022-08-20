<template>
    <nav>
        <v-app-bar app dark style="height: 70px;">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-select class="mt-6"
                :items="supplierList"
                @change="onSuppChange"
                dense
                solo
                outlined
                label="בחר קבלן"
            ></v-select>
            <v-row>
                <v-col class="summary">
                    תקציב = {{budget.toLocaleString()}}
                    <p></p>
                    שולם = {{total.toLocaleString()}}
                    <p></p>
                    נותר = {{(budget-total).toLocaleString()}}
                </v-col>
            </v-row>
            <payments-list @getData = "getValues" :noData = "true" />
            <Payment title="New Payment" :paymentToUpdate="null"/>
            <v-icon small @click="deleteAllPayments()">mdi-delete</v-icon>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" class="primary">
            <v-list>
                <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                    <v-list-item-action>
                        <v-icon class="white--text">{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{link.text}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
    
</template>



<script>
import TableDataService from "../services/TableDataService";
import ProjectDataService from "../services/ProjectDataService";
import PaymentDataService from "../services/PaymentDataService";
import Payment from './Payment.vue';
import PaymentsList from './PaymentsList.vue';
// import PaymentsList from './PaymentsList.vue';
export default {
    components: {Payment, PaymentsList},
    data() {
        return {
            drawer: false,
            links: [
                {icon: 'dashboard', text: 'כרטסת ראשית', route: '/'},
                {icon: 'person', text: 'הוסף רשומה (קוד מקורי)', route: '/add'},
                {icon: 'folder', text: 'Load Scv', route: '/loadCsv'},
                {icon: 'folder', text: 'הוסף חשבונית', route: '/addInv'},
                {icon: 'folder', text: 'עדכון תשלום', route: '/Payment'},
                {icon: 'folder', text: 'טבלת הטבלאות', route: '/tableList'},
                {icon: 'folder', text: 'פרויקטים', route: '/project'},
            ],
            supplierList : [],
            selectedSupplier : "",
            total: '??????',
            count: '???',
            budget: '',
        }
    },
    
    methods: {
        loadTable:async function (table_id,key) {
            try {
                const response = await TableDataService.findByTableID(table_id);
                if(response) {
                    this[key] = response.data.map(code => code.description);
                    this[key].sort();
                }
            } catch (error) {
                console.log(error);
            }
        },

        loadSupplier:async function (supplier) {
            try {
                const response = await ProjectDataService.findBySupplier(supplier);
                if(response) {
                    this.budget = response.data[0].budget;
                    // console.log(response.data[0]);
                }
            } catch (error) {
                console.log(error);
            }
        },

        deleteAllPayments() {
            if (window.confirm('Are you sure you want to delete all items ?')){
                PaymentDataService.deleteAll()
                .then((response) => {
                    console.log(response);
                    // this.$router.push({ name : "payments", params: {} });
                })
                .catch((e) => {
                    console.log(e);
                });
            }
        },

        async onSuppChange(event) {
            this.$root.$emit('suppChange',event);
            await this.loadSupplier(event);
        },

        getValues(count,total) {
            this.total = total;
            this.count = count;
        }
    },

    async mounted() {
        await this.loadTable(1,'supplierList');
    },

    watch : {
        selectedSupplier () {
            this.$refs.PaymentsList.retrievePayments(this.selectedSupplier);
        },
    }
}
</script>

<style>
    .v-input__slot {
      max-width: 100px;
      max-height: 60px;
    }

    .v-toolbar__content{
        height: 70px !important;
        padding-right: 1px !important;
        padding-left: 1px !important;
    }

    .summary {
        font-size: small;
    }

    .v-application p {
        margin-bottom: 4px;
    }

</style>