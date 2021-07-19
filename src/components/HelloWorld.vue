<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Selecione um projeto abaixo
    </p>
    <multiselect
      class="multisel"
      v-model="selected"
      trackBy="key"
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
export default {
  name: "HelloWorld",
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
    };
  },
  watch: {
    selected(val) {
      if (val) {
        this.fetchSprintReport(val);
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
      this.projects = data;
      this.isLoading = false;
    },
    async fetchSprintReport() {
      this.isLoading = true;
      this.response = "";
      this.status = "";
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

          this.response = JSON.stringify(x, null, 2);
        })
        .catch((e) => {
          this.status = "error";
          this.response = e.message;
          return;
        });
      this.isLoading = false;

      console.log(data);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
}
</style>
