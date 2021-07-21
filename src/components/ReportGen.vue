<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Selecione um projeto abaixo
    </p>
    <div class="select-wrapper">
      <multiselect
        class="multisel"
        v-model="selected"
        trackBy="name"
        label="name"
        valueProp="key"
        :disabled="isLoading"
        :loading="isLoading"
        multiple="false"
        :searchable="true"
        :allow-empty="false"
        :options="projects"
      >
      </multiselect>
      <button v-if="generated_workbook" class="download" @click="downloadSheet">
        Baixar relatório
      </button>
    </div>
    <div class="pre-wrapper">
      <pre :class="{ error: status == 'error', ok: status == 'ok' }">{{
        response
      }}</pre>
    </div>
  </div>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>
<script>
import Multiselect from "@vueform/multiselect";
import XLSX from "xlsx";
export default {
  name: "ReportGen",
  components: {
    Multiselect,
  },
  data() {
    return {
      isLoading: false,
      projects: ["default"],
      selected: undefined,
      response: "",
      status: "",
      generated_workbook: undefined,
    };
  },
  watch: {
    selected(val) {
      if (val) {
        this.fetchSprintReport(val);
      } else {
        this.response = "";
        this.status = "";
        this.generated_workbook = undefined;
      }
    },
  },
  props: {
    msg: String,
  },
  beforeMount() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.isLoading = true;
      let data = await fetch(
        "https://jira-automation-experiment.herokuapp.com/getprojects"
      ).then((x) => {
        return x.json();
      });
      console.log(data);
      this.projects = data.sort((a, b) => a.name.localeCompare(b.name));
      this.isLoading = false;
    },
    async fetchSprintReport() {
      this.isLoading = true;
      this.response = "";
      this.status = "";
      this.generated_workbook = undefined;
      let data = await fetch(
        `https://jira-automation-experiment.herokuapp.com/getsprintreport/${this.selected}`
      )
        .then((x) => {
          if (x.ok) {
            return x.json();
          } else throw new Error("Sem dados para exibição");
        })
        .then((x) => {
          this.status = "ok";
          this.response = x;
          this.makeSpreadsheet(x);
        })
        .catch((e) => {
          this.status = "error";
          this.response = e.message;
          return;
        });
      this.isLoading = false;

      console.log(data);
    },
    makeSpreadsheet(data) {
      let parsed = this.prepareData(data);
      let ws = XLSX.utils.json_to_sheet(parsed);
      const merge = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 8, c: 0 }, e: { r: 8, c: 1 } },
      ];
      ws["!merges"] = merge;
      console.log(parsed, ws);
      let wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sprint Report");
      this.generated_workbook = wb;
    },
    downloadSheet() {
      XLSX.writeFile(
        this.generated_workbook,
        `${this.selected}_sprint_report.xlsx`
      );
    },
    prepareData(data) {
      console.log(data);
      let sprint = data.sprint;
      let issues = data.completed_issues;

      let firstPart = [
        {
          "Detalhes da Sprint ": "Nº da AS ",
          "": "",
        },
        {
          "Detalhes da Sprint ": "Sprint ",
          "": sprint.name,
        },
        {
          "Detalhes da Sprint ": "Período ",
          "": sprint.parsedDates.period,
        },
        {
          "Detalhes da Sprint ": "Objetivo ",
          "": sprint.goal,
        },
        {
          "Detalhes da Sprint ": "Reunião de Entrega",
          "": sprint.parsedDates.completedDate,
        },
        {
          "Detalhes da Sprint ": "STATUS FINAL ",
          "": "ACEITA ",
        },
        {
          "Detalhes da Sprint ": "OBSERVAÇÕES ",
          "": " --------- ",
        },
        {
          "Detalhes da Sprint ": `Status das Histórias - Entrega ${sprint.name}`,
        },
      ];

      let secondPart = issues.reduce((acc, issue) => {
        let issueObjs = [
          {
            "Detalhes da Sprint ": "História ",
            "": issue.summary,
          },
          {
            "Detalhes da Sprint ": "Dod ",
            "": issue.description,
          },
          {
            "Detalhes da Sprint ": "Link - JIRA ",
            "": issue.url,
          },
          {
            "Detalhes da Sprint ": "Status: ",
            "": " ACEITA ",
          },
          {
            "Detalhes da Sprint ": "Observações ",
            "": " --------- ",
          },
        ];
        acc = [...acc, ...issueObjs];
        return acc;
      }, []);

      return [...firstPart, ...secondPart];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
div.select-wrapper {
  display: flex;
  justify-content: center;
}

.download {
  margin-left: 1rem;
}

div.pre-wrapper {
  display: flex;
  max-width: 100%;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}
pre {
  text-align: initial;
  max-width: 70%;
  white-space: pre-wrap;
  word-wrap: break-word;
  border-radius: 4px;
}
.ok {
  padding: 1rem;
}
.error {
  color: Red;
  padding: 0.3rem 0.5rem;

  border: 2px solid red;
}
.multisel {
  max-width: 35%;
  margin: unset;
}
</style>
