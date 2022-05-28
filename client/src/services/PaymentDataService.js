import http from "../http-common";
import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;
class PaymentDataService {
  getAll() {
    return http.get("/payments");
  }

  get(id) {
    return http.get(`/payments/${id}`);
  }

  create(data) {
    return http.post("/payments", data);
  }

  update(id, data) {
    return http.put(`/payments/${id}`, data);
  }

  delete(id) {
    return http.delete(`/payments/${id}`);
  }

  deleteAll() {
    return http.delete(`/payments`);
  }

  findByTitle(title) {
    return http.get(`/payments?description=${title}`);
  }

  findByYear(year) {
    return http.get(`/payments?year=${year}`);
  }

  findBySupplier(supplier) {
    return http.get(`/payments?supplier=${supplier}`);
  }

  findByInvoiceAndUpdate(company, year, invoiceId, excelRecID) {
    return http.put(`/payments/update-records`, {
      company,
      year,
      invoiceId,
      excelRecID
    })
  }

  async saveBulk(bulk) {
    var formData = new FormData();
    formData.append("file", bulk);
    return await axios.post(`${baseUrl}/payments/save-bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

}

export default new PaymentDataService();