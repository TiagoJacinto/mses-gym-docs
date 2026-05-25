import { describe, expect, it } from "vitest";
import {
	getChildrenOf,
	hasChildHeading,
	headingExists,
	parseDocument,
} from "./trabalho-mses-heading-tree";

const { headingTree, flat } = parseDocument();

describe("Trabalho-MSES.md heading structure", () => {
	describe("Descrição do Problema", () => {
		it('should have heading "2.1. Descrição do Problema"', () => {
			expect(headingExists("2.1. Descrição do Problema", flat)).toBe(true);
		});

		it('should have "2.1.1. Descrição do Sistema" as child of "2.1. Descrição do Problema"', () => {
			expect(
				hasChildHeading(
					"2.1. Descrição do Problema",
					"2.1.1. Descrição do Sistema",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "2.1.2. Objetivo do Software" as child of "2.1. Descrição do Problema"', () => {
			expect(
				hasChildHeading(
					"2.1. Descrição do Problema",
					"2.1.2. Objetivo do Software",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "2.1.3. Contexto de Utilização" as child of "2.1. Descrição do Problema"', () => {
			expect(
				hasChildHeading(
					"2.1. Descrição do Problema",
					"2.1.3. Contexto de Utilização",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "2.1.4. Principais Funcionalidades Esperadas" as child of "2.1. Descrição do Problema"', () => {
			expect(
				hasChildHeading(
					"2.1. Descrição do Problema",
					"2.1.4. Principais Funcionalidades Esperadas",
					headingTree,
				),
			).toBe(true);
		});

		it('should have exactly 4 children under "2.1. Descrição do Problema"', () => {
			expect(
				getChildrenOf("2.1. Descrição do Problema", headingTree),
			).toHaveLength(4);
		});
	});

	describe("Stakeholders e Utilizadores", () => {
		it('should have heading "3. Stakeholders e Utilizadores"', () => {
			expect(headingExists("3. Stakeholders e Utilizadores", flat)).toBe(true);
		});

		it('should have "1. Atores Principais" as child of "3. Stakeholders e Utilizadores"', () => {
			expect(
				hasChildHeading(
					"3. Stakeholders e Utilizadores",
					"1. Atores Principais",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "2. Atores Secundários" as child of "3. Stakeholders e Utilizadores"', () => {
			expect(
				hasChildHeading(
					"3. Stakeholders e Utilizadores",
					"2. Atores Secundários",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "3. Administradores" as child of "3. Stakeholders e Utilizadores"', () => {
			expect(
				hasChildHeading(
					"3. Stakeholders e Utilizadores",
					"3. Administradores",
					headingTree,
				),
			).toBe(true);
		});

		it('should have "4. Sistemas Externos" as child of "3. Stakeholders e Utilizadores"', () => {
			expect(
				hasChildHeading(
					"3. Stakeholders e Utilizadores",
					"4. Sistemas Externos",
					headingTree,
				),
			).toBe(true);
		});

		it('should have exactly 4 children under "3. Stakeholders e Utilizadores"', () => {
			expect(
				getChildrenOf("3. Stakeholders e Utilizadores", headingTree),
			).toHaveLength(4);
		});
	});

	describe("Requisitos Funcionais", () => {
		it('should have "4.1. Requisitos Funcionais (RF)" as child of "4. Identificação e Descrição dos Requisitos"', () => {
			expect(
				hasChildHeading(
					"4. Identificação e Descrição dos Requisitos",
					"4.1. Requisitos Funcionais (RF)",
					headingTree,
				),
			).toBe(true);
		});
	});
});
