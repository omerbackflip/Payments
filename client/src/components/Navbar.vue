<template>
    <nav>
        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                        <v-icon left>expand_more</v-icon>
                        <span>Menu</span>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
                        <v-list-item-title>{{link.text}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-select class="mt-6"
                :items="supplierList"
                @change="onSuppChange"
                dense
                solo
                outlined
                label="בחר ספק"
            ></v-select>
            <Payment title="New Payment" :paymentToUpdate="null"/>
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
import Payment from "./Payment.vue"
export default {
    components: {Payment},
    data() {
        return {
            drawer: false,
            links: [
                {icon: 'dashboard', text: 'כרטסת ראשית', route: '/'},
                {icon: 'person', text: 'הוסף רשומה (קוד מקורי)', route: '/add'},
                {icon: 'folder', text: 'Load Scv', route: '/loadCsv'},
                {icon: 'folder', text: 'הוסף חשבונית', route: '/addInv'},
                {icon: 'folder', text: 'Load Csv Book', route: '/loadBookCsv'},
                {icon: 'folder', text: 'עדכון תשלום', route: '/Payment'},
                {icon: 'folder', text: 'טבלת הטבלאות', route: '/tableList'},
            ],
            supplierList : [],
            selectedSupplier : "",
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

        onSuppChange(event) {
            this.$root.$emit('suppChange',event);
        },
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